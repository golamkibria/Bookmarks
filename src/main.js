// Copyright (c) 2021 gkmobin.net@gmail.com. All rights reserved.
(function (_) {

	function sortBookmarks(info, tab) {
		//console.log('callbackHandler: ', info, tab);

		const url = new URL(tab.url);
		console.log('Tab.URL:', url, url.hostname);

		if (url.hostname != 'bookmarks')
			return;

		const currentBookmarkNodeId = url.searchParams.get('id');
		console.log('ContextMenuID', currentBookmarkNodeId)

		chrome.bookmarks.get(currentBookmarkNodeId, function (node) {
			console.log('BookmarkNode: ', node);

			chrome.bookmarks.getChildren(currentBookmarkNodeId, function (children) {

				//Sort by reverse order
				var sortedChildren = _.sortBy(children, function (item) {
					return [_.has(item, 'dateGroupModified') ? 0 : 1, item.title];
				});

				_.each(sortedChildren, function (item, index) {
					console.log(item);
					chrome.bookmarks.move(item.id, { index: index, parentId: node.id });
				});
			});
		});
	}

	function setUpContextMenus() {

		chrome.contextMenus.create({
			title: 'KNET: Bookmarks',
			id: 'bookmarks@knet.com',
			contexts: ['all'],
			documentUrlPatterns: ['chrome://bookmarks/*'],
			onclick: sortBookmarks
		});
	}

	chrome.runtime.onInstalled.addListener(function (info, tab) {
		setUpContextMenus();
		console.log('KNet:Bookmarks: Initialized');
	});

})(_);